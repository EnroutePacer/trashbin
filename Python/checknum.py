# times x appear from 1 to num

def check(num,x):
    n=0
    while num!=0:
        temp=num%10
        n+=(temp==x)
        num//=10
    return n

start=1
end, x = map(int, input().strip().split())
sum=0
for i in range(start,end+1):
    sum+=check(i,x)
print(sum)