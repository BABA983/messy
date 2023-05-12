#include <stdio.h>
#include <cs50.h>

int main(){
	string answer = get_string("what's your name? ");
	printf("Hello, %s \n",answer);
}