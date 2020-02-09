#


import numpy as np
import matplotlib.pyplot as plt


N=20
np.random.seed(46)
points_original = np.random.normal(loc=0.5, scale=0.5, size=(N, 2))
points = list(points_original)

A = [0,0]
B = [1, 1]

path = []

def insert(arr, index, el):
    a = arr.copy()
    a.insert(index, el)
    return a

def loss_dst(a, b):
    dst = distance(a, b)
    total = distance(A, B)
    #return np.power(max(0, dst / total - (total / (N+1))), 2) + max(0, dst / total - (total / (N+1)))
    x = dst / (total / (N+1))
    v = -np.log(x)
    v *= 1 if v > 0 else -1*(x-1)
    return v


def distance(a, b):
    return np.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2)


def loss(path):
    arr = [A] + path + [B]
    pairs = ((arr[i], arr[i+1]) for i in range(len(arr)-1))
    return sum(loss_dst(pair[0], pair[1]) for pair in pairs)

while len(path) < 5:
    options = [(pointi, index) for pointi in range(len(points)) for index in range(0, len(path)+1)]

    pointi, index = min(options, key=lambda x: loss(insert(path, x[1], points[x[0]])))
    path.insert(index, points[pointi])
    points.pop(pointi)

print(path)

path = [A] + path + [B]
for pair in ((path[i], path[i+1]) for i in range(len(path)-1)):
    pair = np.array(pair)
    print(pair)
    plt.plot(pair[:,0], pair[:,1])

plt.scatter(points_original[:,0], points_original[:,1])
plt.show()

#%%
