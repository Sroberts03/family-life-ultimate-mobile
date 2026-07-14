SELECT
                    c.id,
                    ct.name,
                    ct.description,
                    c.due_date,
                    c.date_completed,
                    array_agg(uc.user_id) as assignee_ids,
                    array_agg(a.raw_user_meta_data->>'display_name') as assignee_names
                FROM
                    chores as c
                JOIN chore_templates as ct on c.chore_id = ct.id
                JOIN user_chore uc on c.id = uc.chore_id
                JOIN auth.users as a ON uc.user_id = a.id
                WHERE ct.family_id = 'dbdb7f47-8ac3-4724-a2b1-75cddaea970d'
                AND c.due_date = '2026-07-14'
                GROUP BY
                    c.id,
                    ct.name,
                    ct.description,
                    c.due_date,
                    c.date_completed;