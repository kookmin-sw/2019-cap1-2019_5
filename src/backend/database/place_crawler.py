import selenium.webdriver as wd
from time import sleep
import json
import re
import os

VERSION = 74
### Need to rename chromedriver's name as 'chromedriver_{VERSION}.exe'
PATH = os.path.dirname(os.path.abspath(__file__)) + \
    '\\chromedriver_' + str(VERSION) + '.exe'
print(PATH)
SLEEP_TIME = 2


def get_tags(content):
    condition = re.compile(r'#[^ |^#|^\n]+')
    tags = re.findall(condition, content.text)
    return tags


def crawler():
    ### define chrome options
    chrome_option = wd.ChromeOptions()
    chrome_option.add_argument("--incognito")
    chrome_option.add_argument('window-size=1920x1080')
    # undo the below comment to open chrome
    # chrome_option.add_argument('headless')
    chrome_option.add_argument('disable-gpu')
    chrome_option.add_argument("lang=ko_KR")
    chrome_option.add_argument(
        "user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.36")
    driver = wd.Chrome(PATH, chrome_options=chrome_option)

    # TODO(Taeyoung): add more tags for searching, make multiple search, search via multi-threading
    TAG = '먹스타그램'
    URL = 'https://www.instagram.com/explore/tags/' + TAG
    driver.get(URL)
    sleep(SLEEP_TIME)
    article_container = driver.find_element_by_xpath("//article ")
    articles = article_container.find_elements_by_class_name('v1Nh3')
    articles[0].click()
    sleep(SLEEP_TIME)

    f = open(os.path.dirname(os.path.abspath(__file__)) +
             '\\places.json', 'w', encoding='utf-8')
    places = []
    # replace maximum iter to MAXMUM_SEARCH
    MAXIMUM_SEARCH = 20
    for i in range(0, MAXIMUM_SEARCH):
        print("Processing {}th posting".format(i + 1))
        content_tags = []
        place_name = ''
        try:
            move_right_button = driver.find_element_by_class_name('HBoOv')
            content = driver.find_element_by_class_name('eo2As')
        except Exception as e:
            # print(e)
            sleep(SLEEP_TIME)
            continue
        try:
            location_data = driver.find_element_by_class_name('O4GlU')
        except Exception as e:
            # print(e)
            place_name = 'LOCATION NOT FOUND'
        else:
            place_name = location_data.text
        content_tags = get_tags(content)
        for j in range(0, len(content_tags)):
            content_tags[j] = content_tags[j][1:]
        places.append({'name': place_name, 'tags': content_tags})
        move_right_button.click()
        sleep(SLEEP_TIME)

    print("All process complete")
    f.write(json.dumps(places, indent=4, sort_keys=True, ensure_ascii=False))
    f.close()
    driver.close()


if __name__ == '__main__':
    crawler()
