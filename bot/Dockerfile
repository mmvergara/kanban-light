FROM oven/bun:1.1.43-slim AS builder

ENV NODE_ENV=production

RUN groupadd -r -g 1001 appgroup && \
    useradd -r -u 1001 -g appgroup appuser && \
    mkdir -p /home/appuser/data && \
    chown -R appuser:appgroup /home/appuser

WORKDIR /home/appuser

USER appuser

COPY --chown=appuser:appuser package.json bun.lockb ./

RUN bun install --frozen-lockfile

COPY --chown=appuser:appuser . .

CMD ["bun","start"]

# docker build -t kanban_discord_bot:latest .

# docker run