read -p "Yes or no: " response
case "${response}" in
    y | Y | yes | ok)
        echo "You have confirmed"
        ;;
    n | N | no)
        echo "You have denied"
        ;;
    *)
        echo "'${response}' is not a valid response"
        ;;
esac

read -p "Yes or no: " response
case "${response}" in
    [yY]*)
        echo "You have (probably) confirmed"
        ;;
    [nN]*)
        echo "You have (probably) denied"
        ;;
    *)
        echo "'${response}' is not a valid response"
    ;;
esac
