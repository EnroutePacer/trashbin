#include <iostream>
#include <vector>
#include <string>
#include <sstream>

using namespace std;

int binary_cp(vector<int> a,int start,int end)
{
    if(start==end) 
        return a[start];
    else{
        int left = binary_cp(a,start,(int)((start+end)/2));
        int right = binary_cp(a,(int)((start+end)/2)+1,end);
        return (left>=right ? left:right);
    }
}

int main()
{
    int num = 0;
    vector<int> a;

    string line;
    getline(cin,line);
    stringstream ss(line);

    while(ss >> num)
    {
        a.push_back(num);
    }
    
    int max = binary_cp(a,0,(int)a.size()-1);
    cout << max;
    return 0;
}