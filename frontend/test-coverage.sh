
echo "Running tests with coverage..."
npm test -- --coverage --watchAll=false

if [ $? -eq 0 ]; then
  echo "✅ All tests passed and coverage thresholds met!"
else
  echo "❌ Tests failed or coverage thresholds not met."
  echo "Review the coverage report at: ./coverage/lcov-report/index.html"
fi
