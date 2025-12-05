from App.helper_user_validation import handle_validate_requirements
from App.helper_methods import commit_session, jsonify_template_user
from App.database import db_session as db
from App.models.model_post import Posts
from App.models.model_survey_q_a import Surveys, Section, Question, Choice
from App.models.model_enums import Question_type_inter 
from App.dummy_data import data_user, programs
from App.dummy_data_posts_disect import titles, descriptions, times, sections1, sections2, sections3
from typing import Any
from flask import Blueprint
from sqlalchemy import select
from App.models.model_users import Users
import random

mass_data = Blueprint("mass_data", __name__)

@mass_data.route("/account")
def create_acc():
    for counter, data in enumerate(data_user, start=1):
        username = data.get("username")
        pssw = data.get("password")
        result, flag = handle_validate_requirements(username=username, password=pssw)

        if flag:
            print(f"User: {counter}")
            print(result)
        else:
            program = random.choice(programs)
            user = Users(username=username, school="LSPU", program=program, role="user")
            user.set_password(pssw)
            db.add(user)
            print(f"User: {counter}: Success")

    succ, err = commit_session()
    if not succ:
        print(err)
        return jsonify_template_user(500, False, err)
    
    return jsonify_template_user(200, True, "Success")

@mass_data.route("/acc_id")
def get_acc_id():
    
    stmt = select(Users.id).order_by(Users.id)
    ids = db.scalars(stmt).all()
    return jsonify_template_user(200, True, ids)

@mass_data.route("/posts")
def create_post():
    for data in range(150):

        title_index = data % (len(titles) - 1)
        content_index = data % (len(descriptions) - 1)
        caption_index = (data + 4) % (len(descriptions) - 1)
        approx_index = data % (len(times) - 1)

        seciton1_index = data & (len(sections1) - 1)
        seciton2_index = data + 1 & (len(sections2) - 1)
        seciton3_index = data + 4 & (len(sections3) - 1)


        # -------------------------------------
        # Indexed based survey so there is no chance to duplicate expect for the sections since they are small sample
        title = titles[title_index]
        caption = descriptions[content_index]
        content = descriptions[caption_index]
        approx = times[approx_index]
        sections = [
            sections1[seciton1_index],
            sections2[seciton2_index],
            sections3[seciton3_index],
        ]
        # -------------------------------------

        # --------------------------------------
        # Randomizer survey
        # Drawback is there might be a chance to have duplicates
        '''
        title = random.choice(titles)
        caption = random.choice(descriptions)
        content = random.choice(descriptions)
        approx = random.choice(times)
        sections = [
            random.choice(sections1),
            random.choice(sections2),
            random.choice(sections3),
        ]
        '''
        # --------------------------------------



        stmt = select(Users.id).order_by(Users.id)
        ids = db.scalars(stmt).all()

        user_id = random.choice(ids) if data % 5 != 0 else 1
        
        survey_title = title
        post_caption = caption
        survey_content = content

        tags = ["Academic", "Health", "Technology"]
        target_audience = [
            "business-students",
            "engineering-students",
            "all-students",
            "medical-students",
            "general-public",
        ]
        approx_time = approx

        svy_questions = sections

        post = Posts( title=survey_title, content=post_caption, 
                    user_id=user_id, category=tags, target_audience = target_audience )
        
        survey = Surveys( title=survey_title, content=survey_content, tags=tags,
                        approx_time=approx_time, target_audience = target_audience )
        
        for scounter, svy_section in enumerate(svy_questions, start=1):

            section = Section(another_id=svy_section.get("id"),
                            title=svy_section.get("title"),
                            desc=svy_section.get("description"))
            svy_question_list: list[dict[str, Any]] = svy_section.get("questions")

            for qcounter, q_dict in enumerate(svy_question_list, start=1):
                question = Question(
                                    another_id=f"{qcounter}{q_dict.get("id")}",
                                    question_text=q_dict.get("title"), 
                                    q_type=q_dict.get("type"), 
                                    answer_required=q_dict.get("required", False),
                                    question_number=qcounter, 
                                    url=q_dict.get("video", None),
                                    min_choice=q_dict.get("minChoices"),
                                    max_choice=q_dict.get("maxChoices"),
                                    max_rating=q_dict.get("maxRating", 1)
                                    )

                if q_dict.get("type") in Question_type_inter.CHOICES_TYPE_WEB:
                    for option in q_dict.get("options"):
                        choice = Choice(choice_text=option.get("text"))
                        question.choices_question.append(choice)
                    
                section.question_section.append(question)
            survey.section_survey.append(section)

        post.survey_posts = survey
        if data % 10 != 0:
            post.approved = True
        db.add(post)

    succ, err = commit_session()
    if not succ:
        print(err)
        return jsonify_template_user(500, False, err)
    
    return jsonify_template_user(200, True, "Success")