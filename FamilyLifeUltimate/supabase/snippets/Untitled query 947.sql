UPDATE 
                        chore_templates ct
                    SET 
                        end_date = '2026-07-14'
                    FROM chores c
                    WHERE c.id = 193 and ct.id = c.chore_id;