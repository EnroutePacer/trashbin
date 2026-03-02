#include <iostream>
#include <vector>
#include <string>

void func(std::string s,std::vector <int> &arr)
{
    int sz = s.size();
    if(s[0]=='1')
    {
        for(int j=(s[3]-'0'-1);j<=(s[5]-'0');j++)
        {
            arr[j]+=s[sz-1]-'0';
        }
    }
    if(s[0]=='2')
    {
        int sum=0;
        for(int j=(s[3]-'0'-1);j<=(s[5]-'0');j++)
        {
            sum+=arr[j];
        }
        std::cout << sum << std::endl;
    }
}
int main(void)
{
    int n,op;
    std::cin >> n >> op;
    std::vector <int> arr;
    for(int i = 0; i < n; i++)
    {
        std::cin >>arr[i];
    }
    std::string s;
    for(int i=0;i<op;i++)
    {
        getline(std::cin,s);
        func(s,arr);
    }
    return 0;
}
