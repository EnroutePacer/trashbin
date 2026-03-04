#include <iostream>
#include <deque>
#include <vector>
using namespace std;
int main(void)
{
    int n=0,len=0;
    int max=0;
    int min=10000;
    cin >> n >> len;
    vector<int> arr(n);
    deque<int> wo;
    for(int i=0;i<n;i++)
    {
        cin >> arr[i];
    }
    for(int i=0;i<n;i++)
    {
        while(!wo.empty() && arr[wo.back()]<=arr[i])
        {
            wo.pop_back();
        }
        wo.push_back(i);
        int bound=i-len+1;
        if(!wo.empty() && wo.front()<bound)
        {
            wo.pop_front();
        }
        if(i>=len-1) cout << arr[wo.front()] << endl;
    }
    return 0;
}