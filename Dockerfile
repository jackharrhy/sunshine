FROM debian:stable-slim as get

WORKDIR /bun

RUN apt-get update
RUN apt-get install curl unzip -y
RUN curl --fail --location --progress-bar --output "/bun/bun.zip" "https://github.com/Jarred-Sumner/bun/releases/download/bun-v0.1.5/bun-linux-x64.zip"
RUN unzip -d /bun -q -o "/bun/bun.zip"
RUN mv /bun/bun-linux-x64/bun /usr/local/bin/bun
RUN chmod 777 /usr/local/bin/bun
ADD package.json /bun/
ADD bun.lockb /bun/
RUN bun install

FROM debian:stable-slim
COPY --from=get /usr/local/bin/bun /bin/bun
WORKDIR /app
ADD *.js /app/
ADD bun_shim /app/bun_shim
ADD commands /app/commands
ADD sunshine.db /app/
COPY --from=get /bun/node_modules /app/node_modules

CMD ["bun", "run", "/app/run.js"]
