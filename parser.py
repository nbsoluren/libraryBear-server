import csv

# file = open("dataset.txt", "r")
f = open ("insertion.sql","w")


with open('dataset.csv', 'r') as csvfile:
    reader = csv.reader(csvfile)
    data = [r for r in reader]
    data.pop(0)
    print(data)

f.write("use LibraryBear;\n")
for line in data:
    values = line
    f.write("insert into book (image,title,author,category,borrower) values (" +'"' +values[2]+ '"' + "," + '"' +values[3].replace('"','\\"')+ '"' + "," + '"' + values[4]+'"'+","+'"'+values[6].rstrip()+'"'+',NULL'+');\n')

f.close()
