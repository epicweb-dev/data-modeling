-- @param {String} $1:like
SELECT User.id, User.username, User.name, UserImage.id AS imageId
FROM User
LEFT JOIN UserImage ON UserImage.userId = User.id
WHERE User.username LIKE :like
OR User.name LIKE :like
ORDER BY (
  SELECT Note.updatedAt
  FROM Note
  WHERE Note.ownerId = user.id
  ORDER BY Note.updatedAt DESC
  LIMIT 1
) DESC
LIMIT 50
