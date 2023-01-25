# If a word starts with a ~ tilde character,
# then the shell will expand the tilde into the value of the $HOME variable:

echo ~/dotfiles

# it will expand to $HOME/dotfiles
# if unset HOME
# it will use the current user home directory

unset HOME
echo ~/dotfiles
