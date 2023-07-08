const mapDBToModel = ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  createdAt,
  updatedAt,
}) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  insertedAt: createdAt,
  updatedAt,
});

module.exports = { mapDBToModel };
