class APIFeatures {
  query;
  queryString;
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // copy queryString
    const queryObj = { ...this.queryString };

    // exclude fields to filter
    const excludedFields = ["sort", "skip", "fields", "_start", "_end"];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(gte|gt|lte|lt|in|text|search)\b/g,
      (match) => `$${match}`
    );

    // remove quotations outside of an array
    queryStr = queryStr.replaceAll("'[", "[").replaceAll("]'", "]");

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }

    // if sort fields are the same, this ensures that the sort order never changes
    this.query.sort("-_id");

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }

    return this;
  }

  paginate() {
    const skip = this.queryString._start;
    const limit =
      Number(this.queryString._end) - Number(this.queryString._start);

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = APIFeatures;
