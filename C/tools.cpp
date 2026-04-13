#include "tools.hpp"
Entity::Entity(){
    this->ID = count++;
    this->x = 0;
    this->y = 0;
}
Entity::Entity(int x, int y){
    this->ID = count++;
    this->x = x;
    this->y = y;
}
Entity::~Entity(){
    std::cout << "Entity(ID: " << this->getID() << ") deleted\n";
}

void printEntity(Entity& a){
    std::cout << a.getID() << ": ";
    std::cout << "(" << a.x << "," << a.y << ")" << std::endl;
}

Entity operator+(Entity& a, Entity& b){
    Entity tmp;
    tmp.x = a.x + b.x;
    tmp.y = a.y + b.y;
    return tmp;
}


MagnetEntity::MagnetEntity(){
    this->ID = count++;
    this->x = 0;
    this->y = 0;
    this->range = 0;
}

/* 子类构造函数应当先调用父类，否则会造成重复构造元素
   （此处的结果是 ID 生成了两次）

MagnetEntity::MagnetEntity(int x, int y, int range){
    this->ID = count++;
    this->x = x;
    this->y = y;
    this->range = range;
}
*/
MagnetEntity::MagnetEntity(int x, int y, int range) : Entity(x, y){
    this->range = range;
}

MagnetEntity::~MagnetEntity(){
    /* 构造和析构都会调用父类。同理，此处不需要再写一遍信息
    
    std::cout << "Entity(ID: " << this->getID() << ") deleted\n";
    */
    }

void ActivateMagnet(std::vector<Entity*>& v){
    std::cout << "\nActivate !" << std::endl;

    for(int i = 0; i < v.size(); i++){
        if(auto* me = dynamic_cast<MagnetEntity*>(v[i])){

            int left = std::max(0, i - me->range);
            int right = std::min((int)v.size() - 1, i + me->range);

            for(int j = right; j >= left; j--){
                if(j == i) continue;
                
                me->x += v[j]->x;
                me->y += v[j]->y;

                delete(v[j]);
                v.erase(v.begin() + j);
                
                if(j < i) i--;
            }

            std::cout << "Completed !\n" << std::endl;
        }
    }
}