from App import db, bcrypt

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(32), nullable=False, unique=True)
    __password = db.Column("password" ,db.String(256), nullable=False)
    post = db.relationship("Post", backref="author", lazy=True)

    def __repr__(self):
        return f"User {self.id}"
    
    def get_user(self):
        return {
            "id" : self.id,
            "username" : self.username
        } 
    
    def check_password(self, password):
        return bcrypt.check_password_hash(self.__password, password)
    
    def set_password(self, password):
        self.__password = bcrypt.generate_password_hash(self.__password, password).decode("utf-8")

class Posts(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=True)

    def __repr__(self):
        return f"Post: {self.id}"
    
    def get_post(self):
        return {
            "id" : self.id,
            "user_id" : self.user_id
        }

class Survey(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    def __repr__(self):
        return f"Survey: {self.id}"
    
    def get_post(self):
        return {
            "id" : self.id
        }