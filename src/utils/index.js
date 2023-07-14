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
  created_at: createdAt,
  updated_at: updatedAt,
});

module.exports = { mapDBToModel };
