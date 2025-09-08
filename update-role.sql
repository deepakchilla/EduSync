-- Update user role from STUDENT to FACULTY
UPDATE users 
SET role = 'FACULTY' 
WHERE email = 'vijaya123@gmail.com';

-- Verify the change
SELECT email, role, first_name, last_name FROM users WHERE email = 'vijaya123@gmail.com';
