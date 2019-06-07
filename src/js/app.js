const memoize = (f) => {
    const memo = new Map();
    return (...args) => {
        if (memo.get(args[1])) {
            return memo.get(args[1]);
        } else {
            const result = f(args[0], args[1]);
            memo.set(args[1], result);
            return result;
        }
    };
};

const sum = (numbers) => {
    const sumAux = ([first, ...rest], acc) =>
        first === undefined ? acc : sumAux(rest, first + acc);
    return sumAux(numbers, 0);
};

const avg = (grades) => (grades.length === 0 ? grades.length : sum(grades) / grades.length);

const getStudent = (students, id) => students.find((student) => student.id === id);

const getStudentAvg = (students, id) => avg(getStudentMemo(students, id), grades);

const getStudentAvgMemo = memoize(getStudentAvg);
const getStudentMemo = memoize(getStudent);

const renderStudents = (students) =>
    students.map((student) =>
        $(`<li data-student-id=${student.id}>
          <div>${student.first}</div>
          <div>${student.last}</div>
        </li>`).hover(onHoverHandler(students), () => $('#col2').empty()),
    );

const renderDetailStudent = (students, studentId) => {
    const student = getStudentMemo(students, studentId);
    const studentAvg = getStudentAvgMemo(students, studentId);
    return $(`
        <div class="student-detail">
          <div>First name : ${student.first}</div>
          <div>Last name : ${student.last}</div>
          <div>GPA : ${studentAvg.toFixed(1)}</div>
        </div>`);
};

const onHoverHandler = (students) => (e) => {
    const listItem = $(e.target).closest('li');
    if (listItem.length) {
        const studentId = $(listItem).attr('data-student-id');
        $('#col2').append(renderDetailStudent(students, parseInt(studentId)));
    }
};

$(() => {
    getStudentsFakeApi().then((students) => {
        $('<ul />')
            .append(renderStudents(students))
            .appendTo('#col1');
    });
});
