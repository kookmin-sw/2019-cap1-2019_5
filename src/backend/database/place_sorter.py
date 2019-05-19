# -*- coding:utf-8 -*-

import json
import requests
import threading
import queue
import os
import re
import sys

lock = threading.Lock()


def get_api_key():
    f_config = open(os.path.dirname(os.path.abspath(__file__)) + '/../config/API_KEY.json', 'r')
    js_config = json.load(f_config)
    return js_config['googleAPI']


def thread_get_location(thread_idx, start_idx, end_idx, posts, result_queue):
    th_place_locations = []
    key = get_api_key()
    for i in range(start_idx, end_idx):
        print('Current thread: {} , Requesting location {} / {}'.format(thread_idx, i + 1, end_idx))
        res = requests.get(
            'https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=' + posts[i][
                'location'] + '&inputtype=textquery&fields=formatted_address,name,rating,geometry&key=' + key + '&language=ko')
        res_content = json.loads(res.text)
        if res_content['status'] == 'OK' and res_content is not None:
            address = res_content['candidates'][0]['formatted_address']
            geometry = res_content['candidates'][0]['geometry']['location']
            place_name = res_content['candidates'][0]['name']
            hashtags = posts[i]['hashtags']
            instagram_alias = posts[i]['location']
            timestamp = posts[i]['timestamp']
            link = posts[i]['link']
            try:
                rating = res_content['candidates'][0]['rating']
            except Exception as e:
                # If the rating doesn't exists for this place
                location = {'formatted_address': address, 'name': place_name,
                            'instagram_alias': instagram_alias, 'geometry': geometry,
                            'hashtags': hashtags, 'link': link, 'timestamp': timestamp}
            else:
                location = {'formatted_address': address, 'name': place_name,
                            'instagram_alias': instagram_alias, 'geometry': geometry,
                            'hashtags': hashtags, 'rating': rating, 'link': link, 'timestamp': timestamp}
            th_place_locations.append(location)
        else:
            print('Failed to get due to invalid location')
    lock.acquire()
    result_queue.put(th_place_locations)
    print('thread {} done'.format(threading.currentThread()))
    lock.release()


def convert_to_valid_address(thread_num, tag):
    f_posts = open(os.path.dirname(os.path.abspath(__file__)) + '/places_' + tag + '_posts.json', 'r', encoding='utf-8')
    places_posts = json.load(f_posts)
    f_posts.close()

    posts = list()
    for place in places_posts:
        if place['location'] != 'LOCATION NOT FOUND':
            for caption in place['captions']:
                if 'food' in caption:
                    posts.append(place)
                    break

    posts_num = len(posts)
    # posts_num = 30
    thread_list = list()
    batch_size = int(posts_num / thread_num)
    last_batch_size = batch_size + posts_num % thread_num
    result_queue = queue.Queue()
    for i in range(0, thread_num):
        start_idx = i * batch_size
        if i == thread_num - 1 and last_batch_size != 0:
            end_idx = start_idx + last_batch_size
        else:
            end_idx = start_idx + batch_size
        th = threading.Thread(target=thread_get_location, args=(i, start_idx, end_idx, posts, result_queue))
        thread_list.append(th)
        th.start()

    # Wait for all threads to complete
    for thread in thread_list:
        thread.join()

    converted_places = list()
    while not result_queue.empty():
        for post in result_queue.get():
            converted_places.append(post)

    return converted_places


def main(thread_num=20, tag='먹스타그램'):
    converted_places = convert_to_valid_address(thread_num, tag)
    f_places = open(os.path.dirname(os.path.abspath(__file__)) + '/places_' + tag + '_converted.json', 'w',
                    encoding='utf-8')
    f_places.write(json.dumps(converted_places, indent=4, sort_keys=False, ensure_ascii=False))
    f_places.close()

    zero_count = 0
    for i in range(0, len(converted_places)):
        if '대한민국' not in converted_places[i]['formatted_address']:
            zero_count += 1

    print('Convert Complete {} / {}, Failed to get {} addresses due to invalid location '.format(
        len(converted_places) - zero_count, len(converted_places), zero_count))

    ### Group nearby places into one
    # TODO(Taeyoung): Improve re pattern
    pattern = re.compile('[^ ]+동$|[^ ]+동[0-9]가$|[^ ]+[0-9]가$')
    candidate_pool = list()
    candidate_group_set = set()

    for place in converted_places:
        address_block = place['formatted_address'].split()
        # TODO(Taeyoung): Set locale setting
        if '대한민국' in address_block:
            for word in address_block:
                address = re.search(pattern, word)
                if address is None:
                    continue
                else:
                    # candidate_group_address excludes the country name
                    candidate_group_address = address_block[1:address_block.index(address[0]) + 1]
                    candidate_group_address = ' '.join(candidate_group_address)
                    candidate_group = {'group_name': candidate_group_address, 'group_count': 1}
                    candidate_group['group_data'] = list()
                    candidate_group['group_data'].append(place)

                    if candidate_group_address not in candidate_group_set:
                        candidate_pool.append(candidate_group)
                        candidate_group_set.add(candidate_group_address)
                    else:
                        # TODO(Taeyoung): Improve find & insert algorithm
                        for candidate in candidate_pool:
                            if candidate_group_address == candidate['group_name']:
                                candidate['group_data'].append(place)
                                candidate['group_count'] += 1
                                break

    candidate_pool = sorted(candidate_pool, key=lambda g: g['group_count'], reverse=True)
    f_candidate_pool = open(os.path.dirname(os.path.abspath(__file__)) + '/places_' + tag + '_candidate_pool.json',
                            'w',
                            encoding='utf-8')
    f_candidate_pool.write(json.dumps(candidate_pool, indent=4, sort_keys=False, ensure_ascii=False))
    f_candidate_pool.close()
    print('Grouping complete')


if __name__ == '__main__':
    print('Start grouping')
    try:
        main(int(sys.argv[1]), sys.argv[2])
        # main()
    except Exception as e:
        print(e, '\nInvalid arguments!')
        print('Usage: python {threadnum} {tag}')
