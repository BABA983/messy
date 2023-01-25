# You can use the trap (trap signals and events) command to specify a set of commands to run when the shell receives signals,
# or at certain points such as when the script exits or a function returns
#
# A very common use for traps is to create a 'cleanup' function that is executed when the script exits 
# or if the user aborts execution by pressing Ctrl+C (which sends the SIGINT signal).

# Create a temporary folder for the effective shell download.
source="https://effective-shell.com/downloads/effective-shell-samples.tar.gz"
tmp_dir=$(mktemp -d 2>/dev/null || mktemp -d -t 'effective-shell')
tmp_tar="${tmp_dir}/effective-shell.tar.gz"

# Define a cleanup function that we will call when the script exits or if
# it is aborted.
cleanup () {
    if [ -e "${tmp_tar}" ]; then rm "$tmp_tar}"; fi
    if [ -d "${tmp_dir}" ]; then rm -rf "${tmp_dir}"; fi
}

# Cleanup on interrupt or terminate signals and on exit.
trap "cleanup" INT TERM EXIT

# Download the samples.
curl --fail --compressed -q -s "${source}" -o "${tmp_tar}"

# Extract the samples.
tar -xzf "${tmp_tar}" -C "${tmp_dir}"
