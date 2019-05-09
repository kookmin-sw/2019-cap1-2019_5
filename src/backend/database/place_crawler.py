import selenium.webdriver as wd
from bs4 import BeautifulSoup as bs
from time import sleep
import dateutil.parser
import pytz
import json
import re
import sys
import os
import time
import platform

SLEEP_TIME_SHORT = 1
SLEEP_TIME_MID = 2
SLEEP_TIME_LONG = 4



def get_path():
    if os.path.exists('./chromedriver.exe'):
        return os.path.dirname(os.path.abspath(__file__)) + '/chromedriver.exe'
    elif os.path.exists('./chromedriver'):
        return os.path.dirname(os.path.abspath(__file__)) + '/chromedriver'


def browser():
    ### define chrome options
    chrome_option = wd.ChromeOptions()
    service_args = ['--ignore-ssl-errors=true']
    chrome_option.add_argument("--incognito")
    # chrome_option.add_argument('--start-maximized')
    chrome_option.add_argument('window-size=1920x1080')
    chrome_option.add_argument('disable-gpu')
    chrome_option.add_argument("lang=ko_KR")  # ko_KR or en
    chrome_option.add_argument(
        "user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.36")
    # undo the below comment to open chrome
    chrome_option.add_argument('headless')
    driver = wd.Chrome(get_path(), service_args=service_args,
                       chrome_options=chrome_option)
    # driver = wd.Chrome(get_path(), chrome_options=chrome_option)
    
    # TODO(Taeyoung): add more tags for searching, make multiple search
    TAG = '먹스타그램'
    URL = 'https://www.instagram.com/explore/tags/' + TAG
    driver.get(URL)
    driver.execute_script('window.scrollTo(0, 0)')
    driver.execute_script('window.scrollTo(0, document.body.scrollHeight)')
    sleep(SLEEP_TIME_LONG)
    # driver.execute_script("Object.defineProperty(navigator, 'plugins', {get: function() {return[1, 2, 3, 4, 5];},});")
    # driver.execute_script(
    #     "const getParameter = WebGLRenderingContext.getParameter;WebGLRenderingContext.prototype.getParameter = function(parameter) {if (parameter === 37445) {return 'NVIDIA Corporation'} if (parameter === 37446) {return 'NVIDIA GeForce GTX 980 Ti OpenGL Engine';}return getParameter(parameter);};")

    return driver


def get_post_content(driver):
    content = driver.find_element_by_class_name('eo2As')
    return content


def get_location_data(driver):
    try:
        location_data = driver.find_element_by_class_name('O4GlU')
    except Exception as e:
        # print(e)
        location_name = 'LOCATION NOT FOUND'
    else:
        location_name = location_data.text
    return location_name


def get_captions(article):
    # multiple images may be delivered
    caption_html = article.find_all('img', class_='FFVAD')
    captions = set()
    for image in caption_html:
        if ':' in image['alt']:  # if caption exists
            all_captions = image['alt'].split(':')[1].split(',')
            for caption in all_captions:
                captions.add(caption)
    captions = list(captions)
    return captions


def get_hashtags(content):
    pattern = re.compile(r'#[^ |^#|^\n]+')
    hashtags = re.findall(pattern, content.text)
    for i in range(0, len(hashtags)):
        hashtags[i] = hashtags[i][1:]
    return hashtags


def get_timestamp(article):
    time_html = article.find('time')
    zulu_time = time_html['datetime']
    date = dateutil.parser.parse(zulu_time)
    local_timezone = pytz.timezone('Asia/Seoul')
    local_date = date.replace(tzinfo=pytz.utc).astimezone(local_timezone)
    local_timestamp = local_date.isoformat()
    return local_timestamp


def get_place(driver, tries, max_retries):
    ### fetching the post may take time
    try:
        content = get_post_content(driver)
    except:  # Failed to get content including image class 'eo2As'
        print("Failed to fetch the post\nRetrying...")
        sleep(SLEEP_TIME_MID)
        if tries < max_retries:
            return get_place(driver, tries + 1, max_retries)
    else:
        html = bs(driver.page_source, 'html.parser')
        body = html.find('body')
        article = body.find(class_='M9sTE')  # class of each clicked image

        location_name = get_location_data(driver)
        link = driver.current_url
        captions = get_captions(article)
        hashtags = get_hashtags(content)
        timestamp = get_timestamp(article)
        place_info = {'location': location_name, 'link': link, 'timestamp': timestamp, 'captions': captions,
                 'hashtags': hashtags}
        return place_info


def crawler(max_search_iteration):
    start_time = time.time()
    driver = browser()

    ### find first article
    article_html = driver.find_element_by_xpath("//article ")
    articles = article_html.find_elements_by_class_name('v1Nh3')

    places = []
    for article_idx in range(0, max_search_iteration):
        print('Fetching {} / {}'.format(article_idx + 1, max_search_iteration))
        articles[article_idx].click()
        sleep(SLEEP_TIME_SHORT)
        close_button = driver.find_element_by_class_name('ckWGn')
        places.append(get_place(driver, tries=0, max_retries=2))
        close_button.click()
        if article_idx == len(articles) - 1:
            articles = article_html.find_elements_by_class_name('v1Nh3')
            driver.execute_script(
                'window.scrollTo(0, document.body.scrollHeight)')

    end_time = time.time()
    f = open(os.path.dirname(os.path.abspath(__file__)) +
             '/places.json', 'w', encoding='utf-8')
    f.write(json.dumps(places, indent=4, sort_keys=False, ensure_ascii=False))
    f.close()
    driver.close()
    print(
        "All process complete. Fetched {} posts. Execution time : {:.2f}sec".format(len(places), end_time - start_time))


if __name__ == '__main__':
    print('Start Instagram Crawler')
    crawler(int(sys.argv[1]))
