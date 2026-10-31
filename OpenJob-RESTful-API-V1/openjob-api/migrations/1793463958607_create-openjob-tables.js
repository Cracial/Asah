/* eslint-disable camelcase */
// Migrasi tabel dan relasi OpenJob V1.
exports.up = (pgm) => {
  const created = { type: 'timestamptz', notNull: true, default: pgm.func('current_timestamp') };
  const pk = { type: 'varchar(64)', primaryKey: true, notNull: true };
  const fk = (table) => ({ type: 'varchar(64)', notNull: true, references: `"${table}"`, onDelete: 'RESTRICT' });
  pgm.createTable('users', {
    id: pk,
    name: { type: 'varchar(255)', notNull: true },
    email: { type: 'varchar(255)', notNull: true, unique: true },
    password: { type: 'text', notNull: true },
    role: { type: 'varchar(40)', notNull: true, default: 'user' },
    created_at: created,
  });
  pgm.createTable('companies', {
    id: pk,
    name: { type: 'varchar(255)', notNull: true },
    location: { type: 'varchar(255)', notNull: true },
    description: { type: 'text' },
    created_at: created,
  });
  pgm.createTable('categories', {
    id: pk,
    name: { type: 'varchar(255)', notNull: true },
    created_at: created,
  });
  pgm.createTable('jobs', {
    id: pk,
    company_id: fk('companies'),
    category_id: fk('categories'),
    title: { type: 'varchar(255)', notNull: true },
    description: { type: 'text', notNull: true },
    job_type: { type: 'varchar(100)', notNull: true },
    experience_level: { type: 'varchar(100)', notNull: true },
    location_type: { type: 'varchar(100)', notNull: true },
    location_city: { type: 'varchar(255)' },
    salary_min: { type: 'integer' },
    salary_max: { type: 'integer' },
    is_salary_visible: { type: 'boolean', notNull: true, default: false },
    status: { type: 'varchar(100)', notNull: true, default: 'open' },
    created_at: created,
  });
  pgm.createTable('applications', {
    id: pk,
    user_id: fk('users'),
    job_id: fk('jobs'),
    status: { type: 'varchar(100)', notNull: true, default: 'pending' },
    created_at: created,
  });
  pgm.createTable('bookmarks', {
    id: pk,
    user_id: fk('users'),
    job_id: fk('jobs'),
    created_at: created,
  });
  pgm.addConstraint('bookmarks', 'bookmarks_unique_user_job', { unique: ['user_id','job_id'] });
  pgm.createTable('authentications', {
    token: { type: 'text', primaryKey: true, notNull: true },
    user_id: fk('users'),
    created_at: created,
  });
  pgm.createIndex('jobs', 'company_id');
  pgm.createIndex('jobs', 'category_id');
  pgm.createIndex('applications', 'user_id');
  pgm.createIndex('applications', 'job_id');
  pgm.createIndex('bookmarks', 'job_id');
  pgm.createIndex('authentications', 'user_id');
};
exports.down = (pgm) => {
  for (const name of ['authentications','bookmarks','applications','jobs','categories','companies','users']) {
    pgm.dropTable(name);
  }
};
