#!/bin/sh
set -e

# Default values if not set via environment
: "${MYSQL_HOST:=mysql-db}"
: "${MYSQL_USER:=root}"
: "${MYSQL_PASSWORD:=root}"

echo "⏳ Waiting for MySQL at $MYSQL_HOST:3306 ..."

# Loop until MySQL responds
until mysql -h"$MYSQL_HOST" -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" -e "SELECT 1" >/dev/null 2>&1; do
  echo "🔁 MySQL not ready yet..."
  sleep 3
done

echo "✅ MySQL is ready — starting Node backend..."
exec npm run start


