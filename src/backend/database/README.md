## Instagram Crawler

### Install

1. Make sure you have Chrome browser installed.
2. Download [Chromedriver](https://sites.google.com/a/chromium.org/chromedriver/) and put it in current folder.
3. Install Selenium: `pip3 install -r requirements.txt`.

For linux,
1. `wget https://chromedriver.storage.googleapis.com/2.37/chromedriver_linux64.zip`
2. `unzip chromedriver_linux64.zip`
3. `apt-get install chromium-browser`

### Usage

1. Make sure variable `PATH` is properly assigned in `place_crawler.py`.
2. Enable or disable `headless` in chrome option.
4. Run by `python3 place_crawler.py {number of posts} {number of threads}`
    ex: `python3 place_crawler.py 1000 10`
5. JSON formatted document(including `location`, `link`, `timestamp`,`captions`, `hashtags` respectively) will be created.

####

This crawler might not run properly depending on instagram's update.
argparser will be updated 😅