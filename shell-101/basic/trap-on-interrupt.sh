interrupt_count=0
on_interrupt() {
    if [ $interrupt_count -lt 1 ]; then
        echo "Aborting this operation can cause errors."
        echo "Press Ctrl+C again if you are sure you want to cancel."
        interrupt_count=$((interrupt_count + 1))
    else
        # Convention is to use the status code 130 for interrupted scripts.
        echo "Aborting long operation"
        exit 130
    fi
}

trap on_interrupt INT

total_time=0
while true; do
    echo "Long operation: ${total_time} seconds elapsed"
    sleep 3
    total_time=$((total_time + 3))
done
