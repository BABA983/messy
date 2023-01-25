# Helper function to show how the command should be invoked.
show_help() {
    echo "usage:"
    echo "  common [-h] [-e <command_number>] count"
}

# Process the options.
while getopts ":he:" option; do
    case ${option} in

        # Handle the 'help' option.
        h )
            show_help
            exit 0
            ;;

        # Handle the 'execute command' option by storing the value provided
        # for the option.
        e )
            execute_command=${OPTARG}
            ;;

        # If we have an invalid argument, warn and fail.
        \? )
            echo "The value '${OPTARG}' is not a valid option"
            exit 1
            ;;

        # If we are missing a required argument, warn and exit.
        : )
            echo "The option '${OPTARG}' requires an argument"
            ;;
    esac
done
