ARG POSTGRES_VERSION=alpine
FROM postgres:${POSTGRES_VERSION}

#RUN mkdir -p "$PGDATA" && chmod 700 "$PGDATA"
RUN mkdir -p "$PGDATA" && chown -R postgres:postgres "$PGDATA"
