echo "What is your name?"
read
echo "Hello, $REPLY"

# Reading into Variablues
echo "What is your name?"
read name
echo "Hello, ${name}"

# Prompting for Input
read -p "Please enter your name: " name
echo "Hello, $name"

# Reading secret
read -s -p "Enter a new password: " password
masked_password=$(echo "$password" | sed 's/./*/g') 
# echo "" 的原因是 -s 不会打印回车，所以我们要自己处理一下
echo ""
echo "Your password is: $masked_password"

# Limiting the Input
read -n 1 -p "Continue? (y/n): " yesorno
# 因为限制了只能输入一个字符，没有输入回车，所以也要处理一下
echo ""
echo "You typed: ${yesorno}"

# -d delimiter
read -d ' ' -p "Enter your favourite word (then a space): " word
echo ""
echo "Your favourite word is: ${word}"
