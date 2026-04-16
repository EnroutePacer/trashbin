#include <iostream>
#include "tools.hpp"
int Entity::count = 1;
int main()
{
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

    std::vector<Entity*> v;
    // 类型必须是指针，先在堆上创建对象，再把相应的指针 push 进去
    // 直接把栈上的对象 push 进去会导致派生类被切片
    v.push_back(new Entity(5,6));
    v.push_back(new Entity(1,2));
    v.push_back(new MagnetEntity(1,1,1));
    v.push_back(new Entity(3,2));
    
    // 集成函数指针、Lambda 调用、类型转换
    ForEach(v, [](Entity* me) { printEntity(*me); });

    ActivateMagnet(v);

    ForEach(v, [](Entity* me) { printEntity(*me); });


    for(auto me : v){
        delete me;
    }
    return 0;
}  