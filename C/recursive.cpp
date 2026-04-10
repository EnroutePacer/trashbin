// Aims to listen function calls in stack 

#include "stack_listen.hpp"
int Listener::on_going = 0;

int fib(int n){

    // Create a listener for each function call
    Listener a;

    if(n == 1) return 1;
    if(n == 2) return 2;
    return fib(n-1) + fib(n-2);
}

int main()
{
    int n;
    std::cin >> n;
    std::cout << fib(n);
    return 0;
}