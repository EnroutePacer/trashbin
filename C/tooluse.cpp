#include <iostream>
#include "tools.hpp"
int Entity::count = 1;
int main()
{
    int a1,a2,b1,b2;
    std::cin >> a1 >> a2;
    std::cin >> b1 >> b2;
    
    Entity a(a1,a2);
    Entity b(b1,b2);
    printEntity(a);
    printEntity(b);
    
    std::cin.get();
    {
        Entity c = a + b;
        printEntity(c);
    }
    std::cin.get();
}  