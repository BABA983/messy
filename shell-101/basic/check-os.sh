case "$(uname)" in
    Darwin)
        os="OSX"
        ;;

    Linux)
        os="Linux"
        ;;

    CYGWIN*|MINGW32*|MSYS*|MINGW*)
        os="Windows"
        ;;

    SunOS)
        os="Solaris"
        ;;

    *)
        echo "Unsupported operating system"
        exit 1
        ;;
esac
echo "Your OS is: ${os}"
