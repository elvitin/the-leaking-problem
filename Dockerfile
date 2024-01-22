FROM postgres:16.1-alpine3.19
ENV POSTGRES_USER=leak_problem_user
ENV POSTGRES_PASSWORD=leak_problem_password
ENV POSTGRES_DB=leak_problem_db
LABEL leak_problem_app="leak_problem_app"
VOLUME /var/lib/postgresql/data
EXPOSE 5432