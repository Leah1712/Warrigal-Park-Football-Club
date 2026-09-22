// Scenario 4 (Part B): Mark member as inactive without deleting
router.patch('/:id/deactivate', (req, res) => {
    const { id } = req.params;

    const sql = 'UPDATE members SET is_active = 0 WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ message: 'Database error.' });
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Member not found.' });

        res.json({ message: 'Member marked as inactive successfully.' });
    });
});

module.exports = router;