export function userCollection(db) {
  return db.collection("users");
}

/*
MODELLO UTENTE
{
  username: string,
  name: string,
  surname: string,
  email: string,
  password: string,
  bio: string,
  bannerUrl: string,
  avatarUrl: string,
  isActive: boolean,
  createdAt: Date,
  createdBy: string,
  updatedAt: Date,
  updatedBy: string
}
*/
