#!/bin/bash

set -e

BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d_%H%M%S)

echo "📦 Starting backup process..."

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup PostgreSQL
echo "💾 Backing up PostgreSQL database..."
docker-compose -f docker-compose.prod.yml exec -T postgres pg_dump -U henmo henmo_ai > $BACKUP_DIR/postgres_$DATE.sql

# Backup Redis
echo "💾 Backing up Redis data..."
docker-compose -f docker-compose.prod.yml exec -T redis redis-cli --rdb /data/dump_$DATE.rdb
docker cp $(docker-compose -f docker-compose.prod.yml ps -q redis):/data/dump_$DATE.rdb $BACKUP_DIR/

# Compress backups
echo "🗜️ Compressing backups..."
tar -czf $BACKUP_DIR/henmo_backup_$DATE.tar.gz $BACKUP_DIR/postgres_$DATE.sql $BACKUP_DIR/dump_$DATE.rdb

# Clean up individual files
rm $BACKUP_DIR/postgres_$DATE.sql $BACKUP_DIR/dump_$DATE.rdb

# Keep only last 7 backups
echo "🧹 Cleaning old backups..."
ls -t $BACKUP_DIR/henmo_backup_*.tar.gz | tail -n +8 | xargs -r rm

echo "✅ Backup completed: henmo_backup_$DATE.tar.gz"