# today.sh - creates a 'today' symlink in the home directory folder to a fresh
# temporary folder each day.

# Enable tracing in the script.
set -x

# Get today's date in the format YYYY-MM-DD.
today=$(date +"%Y-%m-%d")

# Create the path to today's temp folder and then make sure the folder exists.
temp_path="./tmp/${today}"
mkdir -p "${temp_path}"

# Now that we've created the folder, make a symlink to it in our homedir.
ln -sf "${temp_path}" "${HOME}/today"

# Disable tracing now that we are done with the work.
set +x

# Write out the path we created.
echo "${temp_path}"
