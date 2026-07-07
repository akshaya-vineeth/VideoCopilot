FROM python:3.11-slim

# Install ffmpeg and clean up apt cache to save space
RUN apt-get update && apt-get install -y ffmpeg && rm -rf /var/lib/apt/lists/*

# Set up a new user named "user" with user ID 1000 (Required by Hugging Face Spaces)
RUN useradd -m -u 1000 user

# Switch to the "user" user
USER user

# Set home to the user's home directory
ENV HOME=/home/user \
	PATH=/home/user/.local/bin:$PATH

# Set the working directory to the user's home directory
WORKDIR $HOME/app

# Copy the current directory contents into the container at $HOME/app setting the owner to the user
COPY --chown=user . $HOME/app

# Install python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose the default port for Hugging Face Spaces
EXPOSE 7860

# Command to run the backend
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "7860"]
