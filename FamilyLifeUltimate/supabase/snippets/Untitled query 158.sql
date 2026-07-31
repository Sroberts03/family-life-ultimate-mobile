SELECT
                    sli.id,
                    sli.family_id as "familyId",
                    sli.quantity,
                    sli.unit,
                    sli.item,
                    sli.purchased,
                    sli.created_at as "createdAt",
                    sli.updated_at as "updatedAt"
                FROM
                    shopping_list_items sli
                WHERE
                    sli.family_id = ?
                    AND (
                        sli.purchased = false 
                        OR (sli.purchased = true AND sli.purchased_date > NOW() - INTERVAL '7 days')
                    )
                GROUP
                    sli.purchased;