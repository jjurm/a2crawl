import json
import requests
import itertools
import numpy as np



def pub_hunting(input_json):
    start_location =input_json["start_location"].split(",")
    end_location =input_json["end_location"].split(",")
    radius =input_json["radius"]
    no_pubs =input_json["no_pubs"]
    start_location = [float(x) for x in start_location]
    end_location = [float(x) for x in end_location]

    location = [(start_location[0]+end_location[0])/2,(start_location[1]+end_location[1])/2]
    api_key = "AIzaSyDi3Fjs700a1_leWLFm51blt8rMwz1s8as"
    
    loc_string = str(location[0])+","+str(location[1])
    url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location={}&radius={}&type=bar&key=".format(loc_string,str(radius))
    url = url + api_key
    
     
    response = requests.get(url)
    b = response.json()
    
    
    pub_ids =[]
    list_of_pubs = ""
    for i in b["results"][0:10]:
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
        return np.power(dst / google_dist(A, B), 2)
    
    
    def loss(path):
        arr = [A] + path + [B]
        pairs = ((arr[i], arr[i+1]) for i in range(len(arr)-1))
        return sum(sqrt_dst(pair[0], pair[1]) for pair in pairs)
    
    while len(path) < no_pubs:
        options = [(point, index) for point in points for index in range(0, len(path)+1)]
    
        point, index = min(options, key=lambda x: loss(insert(path, x[1], x[0])))
        path.insert(index, point)
        points.remove(point)
    
    
    
    path = [A] + path + [B]
    final_pubs = [pub_ids[x] for x in path]
    return final_pubs
    
if __name__ == "__main__":
    print(pub_hunting([51.497799,-0.179220]))
    
