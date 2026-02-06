export function passwordTokenCollection(db) {
    return db.collection("password_reset_tokens");
}

/*
MODELLO
{
  userId: ObjectId,
  token: string,
  expiresAt: Date,
  used: false
}
*/