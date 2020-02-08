import wget
import json
import requests
import itertools


api_key = "AIzaSyDi3Fjs700a1_leWLFm51blt8rMwz1s8as"

#url = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=bar&inputtype=textquery&fields=name,rating,opening_hours&locationbias=circle:1000@51.497799,-0.179220&key="
url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=51.497799,-0.179220&radius=500&type=bar&key="

url = url + api_key
#print(url)



#b = json.load(urllib2.urlopen(url))

response = requests.get(url)
#print(response.text)
#print(response.json())
#b = json.load(response)
#print(response.text)
b = response.json()
#print(b)
#print("hi")
#print(b["results"])
#print("kkkkkkkkkkkkkkkkkkkkkkkkkkkkk")
#print(b["results"][0])
#print(b[0])
list_of_pubs = ""
for i in b["results"][0:10]:
    list_of_pubs = list_of_pubs + str(i["geometry"]["location"]["lat"])+","+str(i["geometry"]["location"]["lng"])+"|"
list_of_pubs = list_of_pubs[:-1]
print(list_of_pubs)

#pub_string = list_of_pubs

url = "https://maps.googleapis.com/maps/api/distancematrix/json?origins={}&destinations={}&mode=walking&language=en&key=".format(list_of_pubs,list_of_pubs)
url = url + api_key
print("hihihihih")
print(url)

response = requests.get(url)

b =response.json()
print(b)
#print(b["rows"])
#for i in b["rows"]:
#    print(i)


no_pubs = 5
pubs = list(range(len(b["rows"])))
list_thing = itertools.permutations(pubs,no_pubs)
print(list(list_thing))

#print("hiiiiii")
#print(pubs)
#print(recursion_func([],list(range(0,3)),no_pubs))
#for i in pubs:
#    print(i)
 ##   a = [x for x in pubs if x != i]
   # print(recursion_func([],a,0,no_pubs))

#print("uuuuuuuuuuu")
#(b["rows"][0])
#print(len(b["rows"]))

#print(b)
#print("hihihihi")
#print(b[0])



#print(response.predictions)
