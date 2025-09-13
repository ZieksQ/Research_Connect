from App import db, bcrypt

'''
    get_ methods are just helper method to convert SQLALCHEMY object to Python dict
'''

# Creates a table for the Users
class Users(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(32), nullable=False, unique=True)
    __password = db.Column("password" ,db.String(256), nullable=False)
    post = db.relationship("Posts", backref="author", lazy=True)

    def __repr__(self):
        return f"User {self.id}"
    
    def get_user(self):
        return {
            "id" : self.id,
            "username" : self.username,
        } 
    
    def check_password(self, password):
        return bcrypt.check_password_hash(self.__password, password)
    
    def set_password(self, password):
        self.__password = bcrypt.generate_password_hash(password).decode("utf-8")

# Creates a table for the Posts
class Posts(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(128), nullable=False)
    content = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)

    def __repr__(self):
        return f"Post: {self.id}"
    
    def get_post(self):
        return {
            "id" : self.id,
            "title" : self.title,
            "content" : self.content,
            "user_id" : self.user_id,
        }

# Creates a table for the Survey
class Surveys(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    def __repr__(self):
        return f"Survey: {self.id}"
    
    def get_survey(self):
        return {
            "id" : self.id,
        }
    
# Creates a table for the Survey to keep track of the revoked tokens
class RefreshToken(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(36), unique=True, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    revoked = db.Column(db.Boolean, default=False, nullable=False)
    expires_at = db.Column(db.DateTime, nullable=False)

    def __repr__(self):
        return f"No. {self.id}"