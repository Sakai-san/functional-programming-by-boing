const memoize = (f) => {
    const memo = new Map();
    return (arg) => {
        if (memo.get(arg)) {
            return memo.get(arg);
        } else {
            const result = f(arg);
            memo.set(arg, result);
            return result;
        }
    };
};
const sum = (numbers) => {
    const sumAux = ([first, ...rest], acc) =>
        first === undefined ? acc : sumAux(rest, first + acc);
    return sumAux(numbers, 0);
};
const avg = (grades) => (grades.length === 0 ? 0 : sum(grades) / grades.length);
const avgMemo = memoize(avg);

const renderStudents = (students) =>
    Object.keys(students).map((key) =>
        $(`<li data-student-id=${students[key].id}>
          <div>${students[key].first}</div>
          <div>${students[key].last}</div>
        </li>`).hover(onHoverHandler(students), () => $('#col2').empty()),
    );

const renderDetailStudent = (students, id) =>
    $(`<div class="student-detail">
          <div>First name : ${students[id].first}</div>
          <div>Last name : ${students[id].last}</div>
          <div>GPA : ${avgMemo(students[id].grades).toFixed(1)}</div>
        </div>`);

const onHoverHandler = (students) => (e) => {
    const listItem = $(e.target).closest('li');
    if (listItem.length) {
        const studentId = $(listItem).attr('data-student-id');
        $('#col2').append(renderDetailStudent(students, studentId));
    }
};

$(() => {
    getStudentsFakeApi().then((students) => {
        $('<ul />')
            .append(renderStudents(students))
            .appendTo('#col1');
    });
});
