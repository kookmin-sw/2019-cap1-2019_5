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

SLEEP_TIME_SHORT = 2
SLEEP_TIME_LONG = 5


def get_path():
    if platform.system() == 'Windows' or platform.system() == 'Linux':
        return os.path.dirname(os.path.abspath(__file__)) + '/chromedriver.exe'
    else:
        return os.path.dirname(os.path.abspath(__file__)) + '/chromedriver'


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
    caption_html = article.find_all('img', class_='FFVAD')  # multiple images may be delivered
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


def get_places(driver, iteration):
    places = []
    for i in range(0, iteration):
        print("Processing {}th posting".format(i + 1))
        ### fetching the post may take time
        try:
            move_right_button = driver.find_element_by_class_name('HBoOv')
        except Exception as e:
            print(e, "Failed to fetch the post")
            sleep(SLEEP_TIME_SHORT)
            continue
        try:
            content = get_post_content(driver)
        except Exception as e:
            print(e, "Failed to fetch the post")
            move_right_button.click()
            sleep(SLEEP_TIME_SHORT)
            continue

        html = bs(driver.page_source, 'html.parser')
        body = html.find('body')
        article = body.find(class_='M9sTE')  # class of each clicked image

        location_name = get_location_data(driver)
        link = driver.current_url
        captions = get_captions(article)
        hashtags = get_hashtags(content)
        timestamp = get_timestamp(article)
        places.append(
            {'location': location_name, 'link': link, 'timestamp': timestamp, 'captions': captions, 'hashtags': hashtags})
        move_right_button.click()
        sleep(SLEEP_TIME_SHORT)
    return places


def crawler(max_search_iteration=5):
    ### define chrome options
    chrome_option = wd.ChromeOptions()
    chrome_option.add_argument("--incognito")
    chrome_option.add_argument('window-size=1920x1080')
    chrome_option.add_argument('disable-gpu')
    chrome_option.add_argument("lang=ko_KR")  # ko_KR or en
    chrome_option.add_argument(
        "user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.36")
    # undo the below comment to open chrome
    # chrome_option.add_argument('headless')
    driver = wd.Chrome(get_path(), chrome_options=chrome_option)

    # TODO(Taeyoung): add more tags for searching, make multiple search
    TAG = '먹스타그램'
    URL = 'https://www.instagram.com/explore/tags/' + TAG
    driver.get(URL)
    sleep(SLEEP_TIME_SHORT)

    ### find first article
    article_container = driver.find_element_by_xpath("//article ")
    articles = article_container.find_elements_by_class_name('v1Nh3')
    articles[0].click()
    sleep(SLEEP_TIME_SHORT)

    start_time = time.time()
    places = get_places(driver, max_search_iteration)
    end_time = time.time()

    print("All process complete. Execution time : {:.2f}sec".format(end_time - start_time))
    f = open(os.path.dirname(os.path.abspath(__file__)) +
             '/places.json', 'w', encoding='utf-8')
    f.write(json.dumps(places, indent=4, sort_keys=False, ensure_ascii=False))
    f.close()
    driver.close()


if __name__ == '__main__':
    print('Start Instagram Crawler')
    try:
        max_search_iteration = sys.argv[1]
    except:
        print("Usage: python3 place_crawler.py 100")
    else:
        crawler(int(sys.argv[1]))
