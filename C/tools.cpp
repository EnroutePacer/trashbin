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