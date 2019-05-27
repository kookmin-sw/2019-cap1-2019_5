# -*- coding:utf-8 -*-

import requests
import json
import os
import re

pattern1 = re.compile('[^ ]+[0-9]+동$')
pattern2 = re.compile('[^ ]+동$')
pattern3 = re.compile('[^ ]동$')


def get_api_key():
    f_config = open(os.path.dirname(os.path.abspath(
        __file__)) + '/../config/API_KEY.json', 'r')
    config = json.load(f_config)
    return config['googleAPI']


def get_parsed_name(place_name):
    p1 = re.match(pattern1, place_name)
    p2 = re.match(pattern2, place_name)
    p3 = re.match(pattern3, place_name)
    if p3:
        return place_name
    elif p1:
        return place_name[:-2]
    elif p2:
        return place_name[:-1]
    else:
        return place_name


tag = '먹스타그램'

f_result = open(os.path.dirname(os.path.abspath(__file__)) +
                '/places_' + tag + '_candidate_pool.json', 'r', encoding='utf-8')

locations = json.load(f_result)

place_id_set = set()
places = list()

for location in locations:
    if '서울특별시' in location['group_name']:
        name = location['group_name']
        url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + \
            name + '&key=' + get_api_key() + '&language=ko'
        res = requests.get(url)
        res_content = json.loads(res.text)

        if res_content['status'] == 'OK' and res_content is not None:
            if res_content['results'][0]['place_id'] in place_id_set:
                duplicate_name = get_parsed_name(
                    res_content['results'][0]['address_components'][0]['long_name'])
                # print('duplicate place! {}'.format(duplicate_name))
                for place in places:
                    if place['name'] == duplicate_name:
                        place['count'] += location['group_count']
                        break
            else:
                place_id_set.add(res_content['results'][0]['place_id'])
                place_name = get_parsed_name(
                    res_content['results'][0]['address_components'][0]['long_name'])
                isDuplicate = False
                for place in places:
                    if place['name'] == place_name:
                        place['count'] += location['group_count']
                        isDuplicate = True
                        break

                if not isDuplicate:
                    lng = res_content['results'][0]['geometry']['location']['lng']
                    lat = res_content['results'][0]['geometry']['location']['lat']
                    location_data = {'coordinates': [
                        lng, lat], 'type': 'Point'}
                    candidate = {'location': location_data,
                                 'name': place_name, 'count': location['group_count']}
                    places.append(candidate)

max_count = places[0]['count']
new_places = list()
for place in places:
    if place['count'] >= 20:
        place['rating_db'] = round(place['count'] / max_count * 5 * 0.4, 2)
        del place['count']
        new_places.append(place)

print('number of places: {}'.format(len(new_places)))

new_places = sorted(new_places, key=lambda g: g['rating_db'], reverse=True)
f_places = open(os.path.dirname(os.path.abspath(__file__)) +
                '/places_location_candidate_rated.json', 'w', encoding='utf-8')
f_places.write(json.dumps(new_places, indent=4,
                          sort_keys=False, ensure_ascii=False))
f_places.close()
