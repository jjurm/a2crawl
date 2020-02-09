import json
import requests
import itertools
import numpy as np



def pub_hunting(input_json):
    api_key = "AIzaSyDi3Fjs700a1_leWLFm51blt8rMwz1s8as"

    start_location_str =input_json["start_location"]
    end_location_str =input_json["end_location"]

    url = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input={}&inputtype=textquery&fields=geometry&key=".format(start_location_str)
    url = url + api_key

    response = requests.get(url)
    b = response.json()
    start_location = [b["candidates"][0]["geometry"]["location"]["lat"],b["candidates"][0]["geometry"]["location"]["lng"]]

    url = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input={}&inputtype=textquery&fields=geometry&key=".format(end_location_str)
    url = url + api_key
    response = requests.get(url)
    b = response.json()
    end_location = [b["candidates"][0]["geometry"]["location"]["lat"],b["candidates"][0]["geometry"]["location"]["lng"]]



    radius =int(input_json["radius"])
    no_pubs =int(input_json["no_pubs"])
    start_location = [float(x) for x in start_location]
    end_location = [float(x) for x in end_location]

    location = [(start_location[0]+end_location[0])/2,(start_location[1]+end_location[1])/2]


    
    loc_string = str(location[0])+","+str(location[1])
    url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={}&radius={}&type=bar&key=".format(loc_string,str(radius))
    url = url + api_key
    
     
    response = requests.get(url)
    b = response.json()
    
    
    pub_ids =[]
    pub_ids.append(start_location)
    pub_ids.append(end_location)
    list_of_pubs = ""
    list_of_pubs += str(start_location[0])+","+str(start_location[1])+"|"
    list_of_pubs += str(end_location[0])+","+str(end_location[1])+"|"
    for i in b["results"][0:8]:
        list_of_pubs = list_of_pubs + str(i["geometry"]["location"]["lat"])+","+str(i["geometry"]["location"]["lng"])+"|"
        pub_ids.append([i["geometry"]["location"]["lat"],i["geometry"]["location"]["lng"]])
    list_of_pubs = list_of_pubs[:-1]
    
    
    url = "https://maps.googleapis.com/maps/api/distancematrix/json?origins={}&destinations={}&mode=walking&language=en&key=".format(list_of_pubs,list_of_pubs)
    url = url + api_key
    
    response = requests.get(url)
    
    b =response.json()
    matrix = b["rows"]
    
    
    points = list(range(len(matrix)))
    points.pop(0)
    points.pop(0)
    
    A= 0 
    B=1
    
    path = []
    
    def google_dist(index_a,index_b):
        return matrix[index_a]["elements"][index_b]["duration"]["value"]
    
    def insert(arr, index, el):
        a = arr[:]
        a.insert(index, el)
        return a
    
    def sqrt_dst(a, b):
        dst = google_dist(a, b)
        return np.power(dst, 2)
    
    def loss(path):
        arr = [A] + path + [B]
        pairs = [(arr[i], arr[i+1]) for i in range(len(arr)-1)]
        return sum(sqrt_dst(pair[0], pair[1]) for pair in pairs)
    
    while len(path) < no_pubs:
        options = [(point, index, loss(insert(path, index, point))) for point in points for index in range(0, len(path)+1)]
    
        point, index, l = min(options, key=lambda x: x[2])
        path.insert(index, point)
        points.remove(point)
    
    
    
    path = [A] + path + [B]
    final_pubs = [pub_ids[x] for x in path]
    return final_pubs
    
