def prime(n):
    k=0
    num=2
    while True:
        mark=1
        for i in range(2,int(num**0.5)+1):
            if num%i==0:
                mark=0
                break
        k+=mark
        if k==n:
            return num
        num+=1


n=int(input("第n个素数:n="))
print("第%d个素数是:%d"%(n,prime(n)))